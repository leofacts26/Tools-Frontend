const Heading = ( props ) => {
  const { title } = props;
  return (
    <header>
      <h1 className="finance-heading">{title}</h1>
    </header>
  )
}
export default Heading