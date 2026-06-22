import { Link } from "react-router-dom";
import { EmptyState } from "@forum/components/ui/EmptyState";
import { Button } from "@forum/components/ui/Button";
import { forumHome } from "@forum/config/site";

export function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you are looking for does not exist in the forum."
      action={
        <Link to={forumHome()}>
          <Button variant="secondary" size="sm">
            Back to all questions
          </Button>
        </Link>
      }
    />
  );
}
