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

// Компонент элемента теста
export function TestItem({ tables, setPage, isPage, title}: { tables: ITable, setPage: (key: string) => void, isPage: string, title: string}) {
  // Получение массива данных из таблицы для текущей страницы
  const listArray = tables[`test_data_${isPage}`];
  // Инициализация состояния для элементов списка
  const initialLiStates: IList[] = listArray ? listArray.map((el) => ({ id: el.id, res: '' })) : [];
  // Состояние для имени студента
  const [student,setStudent] = useState('');
  // Состояние для элементов списка
  const [liStates, setLiStates] = useState<IList[]>([]);
  // Состояние для проверки заполнения данных студента
  const [isLink, setLink] = useState(false)
  // Название теста
  const test_name = title;

  // Эффект для инициализации списка при загрузке компонента
  useEffect(()=>{
    setLiStates(initialLiStates);
  },[])

  // Обработчик изменения значения в поле ввода
  const changeValue = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newListStates = [...liStates];
    newListStates[id] = { ...newListStates[id], res: value };
    setLiStates(newListStates);
  };

  // Обработчик клика по кнопке + 
  const handleClickUp = (id:number) => {
    const newListStates = [...liStates];
    newListStates[id] = newListStates[id].res != '' ? {id: id + 1, res: (Number(newListStates[id].res) + 1).toString()} :  {id: id + 1, res: '1'};
    setLiStates(newListStates);
  }

  // Обработчик клика по кнопке -
  const handleClickDoun = (id:number) => {
    const newListStates = [...liStates];
    newListStates[id] = newListStates[id].res != '' && newListStates[id].res != '0' ? {id: id + 1, res: (Number(newListStates[id].res) - 1).toString()} :  {id: id + 1, res: '0'};
    setLiStates(newListStates);
  }

  // Обработчик события возврата на главную страницу
  const handleLinkClick = () => {
    setPage('*');
  };

  // Если таблицы пусты или не существуют, отображается сообщение об отсутствии данных и кнопка возврата на главную
  if (!listArray && isPage !== '*') {
    return (
      <div className={styles.red}>
        <Link className='buttons_link' onClick={handleLinkClick} to={'/'}>Назад</Link>
        <p>Нет данных</p>
      </div>
    );
  }

  // Функция для получения текущей даты
  function getCurrentDate(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Добавляем нули спереди, если число состоит из одной цифры
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Добавляем нули спереди, если число состоит из одной цифры
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // Обработчик события изменения данных студента
  const handleIntputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    event.target.value.trim() !== '' ? setLink(true) : setLink(false)
    setStudent(event.target.value);
  }

  // Функция для обработки отправки данных на сервер
  const handlePost = async () => {
    try {
      await axios.post('http://localhost:3001/api/result', { //? меняем_тут
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
      {/* Блок навигации и ввода данных студента */}
      <div className={styles.linkBack_block}>
        <Link className='buttons_link' onClick={handleLinkClick} to={'/'}>Назад</Link>
        <label className={styles.label_name} htmlFor="name">Данные студента:</label>
        <input name='name' className={styles.input_name} onChange={handleIntputChange} type="text" id="student" />
      </div>
      {/* Таблица с данными теста */}
      <table border={2}>
        <tr>
          <th></th>
          <th>Перечень практических действий</th>
          <th>Форма представления</th>
          <th>Примерный текст комментариев</th>
          <th>Балл</th>
          <th>клик</th>
        </tr>
        {/* Отображение данных теста */}
        {listArray && listArray.map((el: IRowData, index: number) => {
          return (
            <tr key={el.id}>
              <td className={styles.id}>{el.id}</td>
              <td className={styles.body}>{el.body}</td>
              <td className={styles.move}>{el.move}</td>
              <td className={styles.what}>{el.what}</td>
              {/* Поле для ввода оценки */}
              <td className={styles.input_block}>
                <input 
                  min={0}
                  value={liStates && liStates[index] ? liStates[index].res : ''}
                  className={styles.input_num}
                  type="number"
                  onChange={changeValue(index)}
                />
              </td>
              {/* Кнопки для изменения оценки */}
              <td>
                <button onClick={() => handleClickUp(index)}>+</button>
                <button onClick={() => handleClickDoun(index)}>-</button>
              </td>
            </tr>
          );
        })}
      </table>
      {/* Кнопка отправки данных */}
      {isLink ? (<Link className='buttons_link' onClick={handlePost} to={'/result'}>Отправить</Link>)
      :
      (<span className={styles.alert}>Введите данные студента для отправки</span>)}
      
    </div>
  );
  
}
