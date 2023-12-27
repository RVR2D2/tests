import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'

interface FormInputProps {
    value: string
    onChange: (value: string) => void
}

interface FormCheckboxProps {
    onChange: (isChecked: boolean) => void
}

export default function App() {
    return (
        <BrowserRouter>
            <header className="h-20 bg-primary flex items-center p-4">
                <h1 className="text-3xl text-black">Title</h1>
            </header>
            <main className="flex flex-col p-4 h-full">
                <Switch>
                    <Route path="/login" component={LoginPage} />
                </Switch>
            </main>
        </BrowserRouter>
    )
}

function LoginPage() {
    const history = useHistory()
    const [email, setEmail] = useState<string>('')
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [holdTime, setHoldTime] = useState<number>(0)

    useEffect(() => {
        let timer: NodeJS.Timeout

        if (holdTime === 500) {
            history.push('/login/step-2')
        } else if (holdTime > 0) {
            timer = setTimeout(() => setHoldTime((prev) => prev - 10), 10)
        }

        return () => clearTimeout(timer)
    }, [holdTime, history])

    const handleHold = () => {
        if (isValidEmail(email) && isChecked) {
            setHoldTime(500)
        }
    }

    const isValidEmail = (value: string): boolean => {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://api/endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            if (response.ok) {
                // Успешный запрос, отобразить Success
                alert('Success!')
            } else {
                // Ошибка запроса, отобразить Error
                alert('Error!')
            }
        } catch (error) {
            // Ошибка сети или другая ошибка
            alert('Error!')
        }
    }

    return (
        <Switch>
            <Route path="/login/step-1">
                <FormInput value={email} onChange={setEmail} />
                <div className="p-1"></div>
                <FormCheckbox onChange={setIsChecked} />
                <button className="btn btn-primary mt-auto" onMouseDown={handleHold} onMouseUp={() => setHoldTime(0)}>
                    Hold to proceed ({holdTime}ms)
                </button>
            </Route>
            <Route path="/login/step-2">
                <div>
                    <p>Email: {email}</p>
                    <button onClick={() => history.push('/login/step-1')}>Back</button>
                    <button onClick={handleSubmit}>Confirm</button>
                </div>
            </Route>
        </Switch>
    )
}

function FormCheckbox({ onChange }: FormCheckboxProps) {
    return (
        <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
                <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="label-text">I agree</span>
            </label>
        </div>
    )
}

function FormInput({ value, onChange }: FormInputProps) {
    return (
        <label className="form-control">
            <div className="label">
                <span className="label-text">Email</span>
            </div>
            <input
                type="text"
                placeholder="Type here"
                className="input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    )
}
