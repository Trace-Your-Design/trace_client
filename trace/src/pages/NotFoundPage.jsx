import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

function NotFoundPage() {
  return (
    <PageHeader
      eyebrow="404"
      title="Page not found"
      description="The route does not exist yet."
      actions={
        <Link className="button" to="/">
          Go home
        </Link>
      }
    />
  )
}

export default NotFoundPage
