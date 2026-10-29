import { NotFoundView } from "@/components/layout/NotFoundView";

/** notFound() in an English page (an unknown article slug, Studio before launch). Unmatched URLs use global-not-found. */
export default function NotFound() {
  return <NotFoundView lang="en" />;
}
