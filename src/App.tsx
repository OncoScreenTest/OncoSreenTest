import './App.css'
import QuestionBlock from './components/QuestionBlock'


function App() {
  return (
    <main className="w-full text-black">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-start gap-8">
        <QuestionBlock />
      </div>
    </main>
  )
}

export default App