import DayScheduler from "../components/DayScheduler";

export default function Home() {
  return (
    <main className="flex flex-row w-full min-h-screen h-full items-center justify-between bg-red-500">
      <div className="flex flex-col z-10 w-full h-screen items-center justify-between font-mono text-sm lg:flex bg-blue-500">
        <DayScheduler />
      </div>
    </main>
  )
}
