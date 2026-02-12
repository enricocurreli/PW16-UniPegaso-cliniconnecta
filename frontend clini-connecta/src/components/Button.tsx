
interface ButtonProps {
    type?: "submit" | "reset" | "button" | undefined,
    classes: string,
    disabled?: boolean
    children: React.ReactNode,
    onClick?:()=>void
  }

const Button = ({disabled, type, classes,children, onClick}:ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} type={type} className={classes}>{children}</button>
  )
}

export default Button