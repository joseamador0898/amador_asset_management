import { NotFoundView } from "@/components/layout/NotFoundView";

/** notFound() in a Spanish page (an unknown article slug). Unmatched URLs use global-not-found. */
export default function NotFoundEs() {
  return <NotFoundView lang="es" />;
}
