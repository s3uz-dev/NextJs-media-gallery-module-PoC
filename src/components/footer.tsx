import { Hand, } from 'lucide-react'   
import { ModeToggle } from './mode-toggle'

const Footer = () => {
    return (
        <footer className="mt-auto pb-10 bg-background  shadow-sm">
            <div className="container flex items-center justify-center gap-2">
                <p className="text-sm text-muted-foreground">
                    Creado con{" "}
                    <a
                        href="https://ui.shadcn.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                    >
                        shadcn
                    </a>
                    ,{" "}
                    <a
                        href="https://tailwindcss.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                    >
                        Tailwind CSS
                    </a>{" "}
                    y{" "}
                    <a
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                    >
                        React
                    </a>{" "}
                    por{" "}
                    <a
                        href="https://github.com/s3uz-dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                    >
                        Nelson Suzze
                    </a>
                </p>
                <Hand className="h-4 w-4 text-primary" /> {/* Ícono de manito */}
            </div>
            <div className="container flex items-center justify-center gap-2">
                <ModeToggle />
            </div>
        </footer>
    )
}

export default Footer