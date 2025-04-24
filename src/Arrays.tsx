import { KeyboardEvent, ReactNode, useState } from "react"

const Arrays = () => {
    const [value, setValue] = useState('')
    const [colors, setColors] = useState(['red', 'blue', 'yellow', 'green'])

    const colorsElements = colors.map(color => <li key={color} style={{ color: color }}>
        <input type="checkbox" />
        {color}
    </li>)

    const addColor = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            // const newColors = colors.concat(value)
            // const newColors = colors.filter(c => true)
            // const newColors = colors.slice()
            // const newColors = colors.map(color => color)
            // newColors.push(e.target.value)
            // setColors(newColors)
            setColors([value, ...colors]) // לוקח את כל האיברים של colors ומכניס למערך חדש + האיבר החדש
            setValue('')
        }
    }

    const suffleColors = () => {
        setColors([...colors].sort(() => Math.random() - 0.5))
    }

    return <>
        <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={addColor}
        />
        <ul>{colorsElements}</ul>
        <button onClick={suffleColors}>Suffle</button>
    </>
}

export default Arrays


// לפני שמשתמשים בפונקציות צריך לעשות העתקה עמוקה
// pop/push
// shift/ushift
// splice
// sort




 // const colorsElements: ReactNode[] = []
 // colors.forEach(color => {
 //     const colorElement = <li>{color}</li>
 //     colorsElements.push(colorElement)
 // })

    
// מפתח צריך להיות יחודי בין שאר האיברים במערך אלא אם כן מדובר ב 2 מערכים שונים
// צריך להיות קבוע בין רינדורים, כדי שריאקט תזהה שמדובר באותו איבר