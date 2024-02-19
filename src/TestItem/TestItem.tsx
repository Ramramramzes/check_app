import styles from './testitem.module.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

interface IRowData {
  id: number;
  body: string;
  move: string;
  what: string;
  done: number;
}

interface ITable {
  [tableName: string]: IRowData[];
}

interface IList{
  id: number;
  res: string;
}

export function TestItem({ tables, setPage, isPage, title}: { tables: ITable, setPage: (key: string) => void, isPage: string, title: string}) {
  const listArray = tables[`test_data_${isPage}`];
  const initialLiStates: IList[] = listArray ? listArray.map((el) => ({ id: el.id, res: '' })) : [];
  const [student,setStudent] = useState('');
  const [liStates, setLiStates] = useState<IList[]>([]);
  const [isLink, setLink] = useState(false)
  // test_name, student, student_res, date 
  const test_name = title;
//?---------------------------------------------

// const initialLiStates: IList[] = listArray.map((el) => ({ id: el.id, res: false }));

useEffect(()=>{
  setLiStates(initialLiStates);
},[])

const changeValue = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  const newListStates = [...liStates];
  newListStates[id] = { ...newListStates[id], res: value };
  setLiStates(newListStates);
};

const handleClickUp = (id:number) => {
  const newListStates = [...liStates];
  newListStates[id] = newListStates[id].res != '' ? {id: id + 1, res: (Number(newListStates[id].res) + 1).toString()} :  {id: id + 1, res: '1'};
  setLiStates(newListStates);
}

const handleClickDoun = (id:number) => {
  const newListStates = [...liStates];
  newListStates[id] = newListStates[id].res != '' && newListStates[id].res != '0' ? {id: id + 1, res: (Number(newListStates[id].res) - 1).toString()} :  {id: id + 1, res: '0'};
  setLiStates(newListStates);
}


const handleLinkClick = () => {
  setPage('*');
};

//?---------------------------------------------

  if (!listArray && isPage !== '*') {
    return (
      <div className={styles.red}>
        <Link className='buttons_link' onClick={handleLinkClick} to={'/'}>Назад</Link>
        <p>Нет данных</p>
      </div>
    );
  }

  function getCurrentDate(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Добавляем нули спереди, если число состоит из одной цифры
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Добавляем нули спереди, если число состоит из одной цифры
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  const handleIntputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    event.target.value.trim() !== '' ? setLink(true) : setLink(false)
    setStudent(event.target.value);
  }
  const handlePost = async () => {
    try {
      await axios.post('http://localhost:3001/api/result', {
        test_name: test_name,
        student: student,
        student_res: liStates,
        date: getCurrentDate()
      });
      console.log('Данные отправлены');
      
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
    setPage('*');
  }




  return (
    <div className={styles.red}>
      <h1>{title}</h1>
      <div className={styles.linkBack_block}>
        <Link className='buttons_link' onClick={handleLinkClick} to={'/'}>Назад</Link>
        <label className={styles.label_name} htmlFor="name">Данные студента:</label>
        <input name='name' className={styles.input_name} onChange={handleIntputChange} type="text" id="student" />
      </div>
      <table border={2}>
        <tr>
          <th></th>
          <th>Перечень практических действий</th>
          <th>Форма представления</th>
          <th>Примерный текст комментариев</th>
          <th>Балл</th>
          <th>клик</th>
        </tr>
        {listArray && listArray.map((el: IRowData, index: number) => {
          return (
            <tr key={el.id}>
              <td className={styles.id}>{el.id}</td>
              <td className={styles.body}>{el.body}</td>
              <td className={styles.move}>{el.move}</td>
              <td className={styles.what}>{el.what}</td>
              <td className={styles.checkbox_block}>
                <input 
                  min={0}
                  value={liStates && liStates[index] ? liStates[index].res : ''}
                  className={styles.checkbox}
                  type="number"
                  onChange={changeValue(index)}
                />
              </td>
              <td>
                <button onClick={() => handleClickUp(index)}>+</button>
                <button onClick={() => handleClickDoun(index)}>-</button>
              </td>
            </tr>
          );
        })}
      </table>
      {isLink ? (<Link className='buttons_link' onClick={handlePost} to={'/result'}>Отправить</Link>)
      :
      (<span className={styles.alert}>Введите данные студента для отправки</span>)}
      
    </div>
  );
  
}
