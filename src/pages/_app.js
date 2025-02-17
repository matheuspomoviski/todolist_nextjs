import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { TaskProvider } from "../utils/ContextApi";
import { AuthProvider } from "../utils/AuthContext";

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <TaskProvider>
                <Component {...pageProps} />;
            </TaskProvider>
        </AuthProvider>
    );
}
