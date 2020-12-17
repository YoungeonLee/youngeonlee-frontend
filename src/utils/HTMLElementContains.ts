// check if element contains a property or method named value
export default function HTMLElementContains(element: string, value: string) {
  const el = document.createElement(element)
  const contains = value in el
  el.remove()
  return contains
}
