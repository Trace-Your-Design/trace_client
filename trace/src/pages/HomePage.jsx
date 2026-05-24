import PageHeader from '../components/PageHeader'
import Section from '../components/Section'

const workflowItems = [
  {
    title: 'Pages',
    description: 'Route-level screens live in src/pages.',
  },
  {
    title: 'Components',
    description: 'Reusable UI pieces live in src/components.',
  },
  {
    title: 'Layouts',
    description: 'Shared shells and navigation live in src/layouts.',
  },
]

function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Project starter"
        title="Trace client"
        description="A clean React workspace structure for routing, pages, components, and shared layout work."
        actions={
          <a className="button" href="https://react.dev/" target="_blank">
            React Docs
          </a>
        }
      />

      <Section
        title="Workspace map"
        description="Start new features from the folder that matches their responsibility."
      >
        <div className="feature-grid">
          {workflowItems.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}

export default HomePage
