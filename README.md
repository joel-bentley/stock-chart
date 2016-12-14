# stock-chart
Built for the 'Chart the Stock Market' challenge on Free Code Camp.

**Live Demo:** https://joel-bentley-stock-chart.herokuapp.com/

---

User story requirements for this project: (<https://www.freecodecamp.com/challenges/chart-the-stock-market>)

1. I can view a graph displaying the recent trend lines for each added stock.

2. I can add new stocks by their symbol name.

3. I can remove stocks.

4. I can see changes in real-time when any other user adds or removes a stock. For this you will need to use Web Sockets.

---

To use, first add .env files in root and /client.
Use yarn to install dependencies within root and /client directories.

For development, type 'npm run dev'

For production, First run 'npm run build' within /client, then run 'npm start' from root.

To deploy to Heroku: create and checkout a deploy branch, build client app after setting proper env variables, remove build directory from .gitignore so files included in commit, and then push this branch to heroku master.
