export const highlightText = (text: string, searchTerm: string) => {
  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))

  return (
    <span>
      {" "}
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} style={{ backgroundColor: "lightblue" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}{" "}
    </span>
  )
}
