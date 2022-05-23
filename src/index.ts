import app from './app';
const port = 3000;

const runningMessage = `Server Running at http://localhost:${port}`;
app.listen(port, () => {
	// our only exception to avoiding console.log(), because we
	// always want to know when the server is done starting up
	console.log(runningMessage);
});
