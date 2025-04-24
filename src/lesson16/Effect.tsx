import { ChangeEvent, useEffect, useState } from 'react';

export default function App2() {
  const [option, setOption] = useState<string>('A');

  const onChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    setOption(event.target.value);
  };

  useEffect(() => {
   const id= setTimeout(() => {
      alert(option);
    }, 2000);
    clearTimeout(id);
  }, [option]);

  return (
    <select value={option} onChange={onChangeHandler}>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
    </select>
  );
}
// A B C D E F G H I J K L M N O P Q R S T U V W X Y Z \\