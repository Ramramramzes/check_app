import styles from './testlist.module.css';
import { Link } from 'react-router-dom';


interface ITable {
  body: string;
}


export function TestList({ tables, setPage }: { tables: ITable[], setPage: (key: string) => void }) {

  if (!tables || tables.length === 0) {
    return <div>No data</div>;
  }

  const handleLinkClick = (key: number) => {
    setPage(key.toString());
  };

  
  
  return (
    <div>
      <ol>
      {tables && tables.map((key,index) => (
          <li key={index}>
            <Link className={styles.link} onClick={()=>handleLinkClick(index + 1)} to={'/'+index}> {key.body} </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
