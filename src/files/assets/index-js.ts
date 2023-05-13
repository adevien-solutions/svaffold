export function getIndexJsContent(): string {
	return `const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static('static'));

app.listen(port, () => {
	console.log(\`Asset files hosted at http://localhost:\${port}\`);
});
`;
}
