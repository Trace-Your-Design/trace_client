function Section({ title, description, children }) {
  return (
    <section className="section">
      <div className="section-heading">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default Section
