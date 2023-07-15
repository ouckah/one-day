import { DayScheduler } from "@/components/Day Scheduler";

export default function Home() {
  return (
    <main className="flex flex-row w-full min-h-screen h-full items-center justify-between bg-red-500">
      <div className="flex flex-col z-10 w-full max-w-5xl h-screen items-center justify-between p-10 font-mono text-sm lg:flex bg-blue-500">
        
        <DayScheduler />

      </div>
      <div className="flex flex-col z-10 w-full max-w-5xl min-h-screen h-full items-center justify-between font-mono text-sm lg:flex bg-yellow-500">
        
        <h1>hi</h1>

      </div>
    </main>
  )
}
