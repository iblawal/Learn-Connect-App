"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log(" server.ts started executing...");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
console.log(" All modules imported successfully...");
dotenv_1.default.config();
console.log(" Environment variables loaded...");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : " Missing");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    'http://localhost:3000',
    'https://my-app-rose-six.vercel.app',
    process.env.FRONTEND_URL
].filter((origin) => Boolean(origin));
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(body_parser_1.default.json());
console.log(" Middleware initialized...");
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
console.log(" Auth routes connected...");
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log(" MongoDB connected successfully"))
    .catch((err) => {
    console.error(" MongoDB connection error:", err);
});
app.get("/", (req, res) => {
    res.send(" Backend API is running successfully!");
});
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
exports.default = app;
