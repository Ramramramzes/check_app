import express  from 'express';
import { createConnection } from 'mysql';

const app = express();
app.use(express.json());

const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'forms_project'
});

connection.connect();

const queryTables = 'SELECT table_name FROM information_schema.tables WHERE table_schema = "forms_project"';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/list', (req, res) => {
  connection.query(queryTables, async (error, results) => {
    if (error) {
      console.error('Ошибка выполнения SQL запроса:', error);
      res.status(500).json({ error: 'Ошибка при получении данных из базы данных' });
      return;
    }
    const queryTableData = `SELECT * FROM test_titles`;

    try {
      const tableResults = await query(queryTableData);
      res.json(tableResults)
    } catch (error) {
      console.error('Ошибка выполнения SQL запроса для таблицы test_titles');
      console.log(results);
    }


    // const tables = results.map(row => row.table_name);
    // const tableData = {};

    // for (const table of tables) {
    //   const queryTableData = `SELECT * FROM ${table}`;
    //   try {
    //     const tableResults = await query(queryTableData);
    //     tableData[table] = tableResults;
    //   } catch (error) {
    //     console.error('Ошибка выполнения SQL запроса для таблицы', table, ':', error);
    //     tableData[table] = { error: 'Ошибка при получении данных из таблицы' };
    //   }
    // }

    // res.json(tableData);
  });
});

app.get('/item', (req, res) => {
  connection.query(queryTables, async (error, results) => {

    const tables = results.map(row => row.table_name);
    const tableData = {};

    for (const table of tables) {
      const queryTableData = `SELECT * FROM ${table}`;
      try {
        const tableResults = await query(queryTableData);
        tableData[table] = tableResults;
      } catch (error) {
        console.error('Ошибка выполнения SQL запроса для таблицы', table, ':', error);
        tableData[table] = { error: 'Ошибка при получении данных из таблицы' };
      }
    }

    res.json(tableData);
  });
});



app.post('/api/result', async (req, res) => {
  const { test_name, student, student_res, date } = req.body;

  const queryInsert = `INSERT INTO result_table ( test_name, student, student_res, date) VALUES ( '${test_name}', '${student}', '${JSON.stringify(student_res)}', '${date}')`;
  try {
    await query(queryInsert, [test_name, student, student_res, date]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при добавлении данных в result_table:', error);
    res.status(500).json({ error: 'Ошибка при добавлении данных в базу данных' });
  }
});

function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

app.listen(3001, () => {
  console.log(`Сервер запущен на порту ${3001}`);
});
