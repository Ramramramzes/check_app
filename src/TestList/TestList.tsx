import styles from './testlist.module.css'; 
import { Link } from 'react-router-dom';

interface ITable {
  body: string;
}

// Компонент списка тестов
export function TestList({ tables, setPage }: { tables: ITable[], setPage: (key: string) => void }) {
  // Если таблицы пусты или не существуют, отображается сообщение об отсутствии данных
  if (!tables || tables.length === 0) {
    return <div>No data</div>;
  }

  // Обработчик клика по ссылке
  const handleLinkClick = (key: number) => {
    setPage(key.toString()); // Устанавливает выбранный ключ в качестве текущей страницы
  };

  return (
    <div>
      <ol>
        {/* Отображение элементов списка с использованием данных из таблицы */}
        {tables && tables.map((table, index) => (
          <li key={index}>
            {/* Ссылка на элемент таблицы с обработчиком клика */}
            <Link className={styles.link} onClick={() => handleLinkClick(index + 1)} to={'/' + index}>
              {table.body} {/* Отображение содержимого элемента */}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
