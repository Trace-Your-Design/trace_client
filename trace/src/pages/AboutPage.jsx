import PageHeader from '../components/PageHeader'
import Section from '../components/Section'

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Built for shared work"
        description="This page is a simple example of adding a new route-backed screen without touching the layout layer."
      />

      <Section
        title="How to add a page"
        description="Create a file in src/pages, then register it in the route list inside App.jsx."
      >
        <div className="note">
          Keep page files focused on screens, and move repeated UI into
          components when another page needs it too.
        </div>
      </Section>
    </>
  )
}

export default AboutPage
