import initApp from "./server";
const PORT = process.env.PORT || 3000;

initApp().then((app) => {
    app.listen(PORT, () => {
        console.log('Server is running on port 3000');
    });
})