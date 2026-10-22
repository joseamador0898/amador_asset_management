#!/usr/bin/env bash
# amadoram.com visitor statistics on Azure Application Insights, as code (adapted from Juricio's deploy/azure/analitica.sh).
# Idempotent: it detects what already exists and skips it, never deletes anything, and can be run any number of times.
#
#   bash deploy/azure/analytics.sh               # resource group, workspace, Application Insights, retention, both workbooks
#   bash deploy/azure/analytics.sh workbooks     # create or update the English and Spanish visitor workbooks only
#   bash deploy/azure/analytics.sh vm-env        # put the browser connection string in the VM's env file (value not printed)
#   bash deploy/azure/analytics.sh status        # show what exists and the retention (changes nothing)
#   bash deploy/azure/analytics.sh all --dry-run # print what it would do
#
# Needs the Azure CLI signed in to the right subscription (az login; az account show). On Windows it runs in Git Bash.
# The telemetry uses Juricio's field names (tipo_trafico, motivo, ...), so these workbooks and Juricio's read both sites.
set -Eeuo pipefail
export MSYS_NO_PATHCONV=1   # Git Bash: keep /subscriptions/... from being turned into a disk path

RG=AMADOR-MX
LOCATION=mexicocentral
WORKSPACE=amador-logs
COMPONENT=amador-web
RETENTION_DAYS=30
DAILY_CAP_GB=0.5
VM=${AMADOR_VM:-luigi@68.155.151.1}
APP_TABLES=(AppAvailabilityResults AppBrowserTimings AppDependencies AppEvents AppExceptions AppMetrics AppPageViews
  AppPerformanceCounters AppRequests AppSystemEvents AppTraces)
# Fixed workbook resource names: running again updates them instead of creating duplicates.
WORKBOOKS=(
  "f5fa55e5-a548-4467-86d7-c85e91941130|Amador visitors|workbook-visitors.en.json"
  "043c4ff3-0818-462d-9e6c-2004bb8cb6ad|Visitantes de Amador|workbook-visitors.es.json"
)
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
DRY=0 ; CMD="" ; TMP=""
trap '[ -z "$TMP" ] || rm -rf "$TMP"' EXIT
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    -h|--help) sed -n '2,13p' "$0"; exit 0 ;;
    -*) die "unknown option: $arg" ;;
    *) [ -z "$CMD" ] || die "one command per call"; CMD=$arg ;;
  esac
done
CMD=${CMD:-all}

run() { if [ "$DRY" = 1 ]; then printf '   [dry run] %s\n' "$*"; else "$@"; fi; }
exists() { "$@" -o none >/dev/null 2>&1; }
winpath() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else printf '%s' "$1"; fi; }
component_id() { az monitor app-insights component show --app "$COMPONENT" -g "$RG" --query id -o tsv; }

ensure_extension() {
  exists az extension show -n application-insights || run az extension add -n application-insights --only-show-errors
}

ensure_group() {
  if exists az group show -n "$RG"; then printf '== resource group %s exists\n' "$RG"
  else printf '== creating resource group %s (%s)\n' "$RG" "$LOCATION"; run az group create -n "$RG" -l "$LOCATION" -o none; fi
}

ensure_workspace() {
  if exists az monitor log-analytics workspace show -g "$RG" -n "$WORKSPACE"; then
    printf '== workspace %s exists\n' "$WORKSPACE"
  else
    printf '== creating workspace %s (retention %s days, cap %s GB a day)\n' "$WORKSPACE" "$RETENTION_DAYS" "$DAILY_CAP_GB"
    run az monitor log-analytics workspace create -g "$RG" -n "$WORKSPACE" -l "$LOCATION" \
      --retention-time "$RETENTION_DAYS" --quota "$DAILY_CAP_GB" -o none
  fi
}

ensure_appinsights() {
  ensure_extension
  if exists az monitor app-insights component show --app "$COMPONENT" -g "$RG"; then
    printf '== Application Insights %s exists\n' "$COMPONENT"
  else
    local ws="<id of $WORKSPACE>"
    [ "$DRY" = 1 ] || ws=$(az monitor log-analytics workspace show -g "$RG" -n "$WORKSPACE" --query id -o tsv)
    printf '== creating Application Insights %s on workspace %s\n' "$COMPONENT" "$WORKSPACE"
    run az monitor app-insights component create --app "$COMPONENT" -g "$RG" -l "$LOCATION" --kind web \
      --application-type web --workspace "$ws" -o none
  fi
}

# The App* tables keep 90 days by default even when the workspace says 30; the privacy notice promises 30.
ensure_retention() {
  printf '== retention of the Application Insights tables (%s days)\n' "$RETENTION_DAYS"
  local table current failed=0
  for table in "${APP_TABLES[@]}"; do
    current=$(az monitor log-analytics workspace table show -g "$RG" --workspace-name "$WORKSPACE" -n "$table" \
      --query "join(' ', [to_string(retentionInDays), to_string(totalRetentionInDays)])" -o tsv 2>/dev/null) || current=""
    if [ "$current" = "$RETENTION_DAYS $RETENTION_DAYS" ]; then continue; fi
    run az monitor log-analytics workspace table update -g "$RG" --workspace-name "$WORKSPACE" -n "$table" \
      --retention-time "$RETENTION_DAYS" --total-retention-time "$RETENTION_DAYS" -o none \
      && printf '   %s: %s -> %s days\n' "$table" "${current:-unknown}" "$RETENTION_DAYS" \
      || { printf 'WARNING: could not set the retention of %s\n' "$table" >&2; failed=1; }
  done
  return $failed
}

# ARM template per workbook: the workbook JSON goes in as a variable, with fallbackResourceIds pointing at amador-web.
template() {
  cat <<'HEAD'
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workbookId": { "type": "string" },
    "workbookDisplayName": { "type": "string" },
    "workbookSourceId": { "type": "string" }
  },
  "variables": {
    "workbook":
HEAD
  cat "$1"
  cat <<'TAIL'
    ,
    "workbookData": "[union(variables('workbook'), createObject('fallbackResourceIds', createArray(parameters('workbookSourceId'))))]"
  },
  "resources": [
    {
      "name": "[parameters('workbookId')]",
      "type": "microsoft.insights/workbooks",
      "location": "[resourceGroup().location]",
      "apiVersion": "2022-04-01",
      "kind": "shared",
      "properties": {
        "displayName": "[parameters('workbookDisplayName')]",
        "serializedData": "[string(variables('workbookData'))]",
        "version": "1.0",
        "sourceId": "[parameters('workbookSourceId')]",
        "category": "workbook"
      }
    }
  ]
}
TAIL
}

ensure_workbooks() {
  ensure_extension
  local source="<id of $COMPONENT>" entry id name file
  [ "$DRY" = 1 ] || source=$(component_id) || die "no $COMPONENT yet: run the default command first"
  TMP=$(mktemp -d)
  for entry in "${WORKBOOKS[@]}"; do
    IFS='|' read -r id name file <<< "$entry"
    [ -f "$HERE/$file" ] || die "missing $file"
    template "$HERE/$file" > "$TMP/$id.json"
    printf '== workbook "%s": create or update\n' "$name"
    run az deployment group create -g "$RG" -n "workbook-${id:0:8}" --template-file "$(winpath "$TMP/$id.json")" \
      --parameters "workbookId=$id" "workbookDisplayName=$name" "workbookSourceId=$source" -o none
  done
  printf '   Portal: Application Insights > %s > Workbooks\n' "$COMPONENT"
}

# The browser only needs the instrumentation key and the ingestion endpoint (no Live Metrics endpoint).
vm_env() {
  ensure_extension
  local full key endpoint
  full=$(az monitor app-insights component show --app "$COMPONENT" -g "$RG" --query connectionString -o tsv)
  key=$(printf '%s' "$full" | grep -oE 'InstrumentationKey=[0-9a-f-]{36}' || true)
  endpoint=$(printf '%s' "$full" | grep -oE 'IngestionEndpoint=https://[a-z0-9.-]+\.applicationinsights\.azure\.com/' || true)
  [ -n "$key" ] && [ -n "$endpoint" ] || die "unexpected connection string format"
  printf '== NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING -> %s:/etc/amador/amador.env (value not shown)\n' "$VM"
  if [ "$DRY" = 1 ]; then printf '   [dry run] ssh %s (replace the line)\n' "$VM"; return; fi
  printf 'NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING="%s;%s"\n' "$key" "$endpoint" | ssh "$VM" \
    'f=/etc/amador/amador.env; t=$(mktemp); sudo grep -v "^NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING=" "$f" > "$t"; cat >> "$t"; sudo install -m 640 -o root -g amador "$t" "$f"; rm -f "$t"'
  printf '   run deploy/deploy.sh so the next build includes it\n'
}

status() {
  ensure_extension
  az group show -n "$RG" --query "{group:name, location:location}" -o tsv 2>/dev/null || printf 'no resource group %s\n' "$RG"
  az monitor log-analytics workspace show -g "$RG" -n "$WORKSPACE" \
    --query "{workspace:name, retentionDays:retentionInDays, dailyCapGb:workspaceCapping.dailyQuotaGb}" -o tsv 2>/dev/null || true
  az monitor app-insights component show --app "$COMPONENT" -g "$RG" --query "{component:name, kind:kind}" -o tsv 2>/dev/null || true
  az resource list -g "$RG" --resource-type microsoft.insights/workbooks --query "[].name" -o tsv 2>/dev/null || true
}

case "$CMD" in
  all) ensure_group; ensure_workspace; ensure_appinsights; ensure_retention || true; ensure_workbooks ;;
  workbooks) ensure_workbooks ;;
  retention) ensure_retention ;;
  vm-env) vm_env ;;
  status) status ;;
  *) die "unknown command: $CMD (all, workbooks, retention, vm-env, status)" ;;
esac
