import { useState } from "react";
import './keyBoard.css';

export default function Keyboard() {
    const lettersEnglishLower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const lettersEnglishUpper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const letterHebrew = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ך', 'ל', 'מ', 'ם', 'נ', 'ן', 'ס', 'ע', 'פ', 'ף', 'צ', 'ץ', 'ק', 'ר', 'ש', 'ת'];
    const arrChar = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '_', '+', '=', ';', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '|', '\''];

    type Lang = 'english' | 'hebrow' | 'char' | 'UpperCase';
    const [lang, setLang] = useState<Lang>("english");
    const [Board, SetBord] = useState<string>(" ");
    const [color, SetColor] = useState("black");
    const [size, Setsize] = useState("50px");
    const [fount, Setfount] = useState("Arial");
    const [history, setHistory] = useState<string[]>([]);

    const saveToHistory = (newState: string) => {
        setHistory([...history, newState]);
    };

    const deleteTav = () => {
        const str = Board.substring(0, Board.length - 1);
        saveToHistory(str);
        SetBord(str);
    };

    const space = () => {
        const newState = Board + " ";
        saveToHistory(newState);
        SetBord(newState);
    };

    const enter = () => {
        const newState = Board + "\n";
        saveToHistory(newState);
        SetBord(newState);
    };

    const deleteAll = () => {
        saveToHistory(" ");
        SetBord(" ");
    };

    const undo = () => {
        if (history.length > 0) {
            const lastState = history[history.length - 1];
            setHistory(history.slice(0, history.length - 1));
            SetBord(lastState);
        }
    };

    const keyBoard = lang === 'hebrow' ? letterHebrew : lang === 'english' ? lettersEnglishLower : lang === 'UpperCase' ? lettersEnglishUpper : arrChar;
    const lettersElements = keyBoard.map(letter => 
        <button key={letter} onClick={() => {
            const newState = Board + letter;
            saveToHistory(newState);
            SetBord(newState);
        }}> {letter} </button>
    );

    return (
        <>
            <div id='bodyDiv'>
                <div id="text" style={{ whiteSpace: 'pre', color: color, fontSize: size, fontFamily: fount }}>
                    {Board}
                </div>
                <div className="keyboard-container">{lettersElements}</div>
                <button onClick={deleteTav}>Delete</button>
                <button onClick={space}>Space</button>
                <button onClick={enter}>Enter</button>
                <button onClick={deleteAll}>Delete All</button>
                <button onClick={undo}>Undo</button>

                <div id="lang">
                    <h3>Language</h3>
                    <button onClick={() => { setLang('english') }}>English</button>
                    <button onClick={() => { setLang('UpperCase') }}>UpperCase</button>
                    <button onClick={() => { setLang('hebrow') }}>עברית</button>
                    <button onClick={() => { setLang('char') }}>&$123</button>

                    <h3>Style</h3>
                    <h1>Choose Color</h1>
                    <input type="color" onChange={(Event) => { SetColor(Event.target.value) }} />
                    <h1>Size</h1>
                    <button onClick={() => Setsize("80px")}>Large</button>
                    <button onClick={() => Setsize("30px")}>Small</button>
                    <h1>Font</h1>
                    <div>
                        <button onClick={() => Setfount('Arial')}>Arial</button>
                        <button onClick={() => Setfount('Times New Roman')}>Times New Roman</button>
                        <button onClick={() => Setfount('Courier New')}>Courier New</button>
                        <button onClick={() => Setfount('Verdana')}>Verdana</button>
                    </div>
                </div>
            </div>
        </>
    );
}