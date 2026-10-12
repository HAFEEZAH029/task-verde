import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Leaf,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'taskverde-tasks';

const starterTasks = [
  {
    id: 'welcome-task',
    title: 'Plan one meaningful thing for today',
    completed: false,
  },
];

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : starterTasks;
  } catch {
    return starterTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks],
  );

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  function addTask(event) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;

    setTasks((currentTasks) => [
      { id: crypto.randomUUID(), title, completed: false },
      ...currentTasks,
    ]);
    setNewTask('');
    setFilter('all');
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function beginEditing(task) {
    setEditingId(task.id);
    setEditValue(task.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditValue('');
  }

  function saveEdit(event) {
    event.preventDefault();
    const title = editValue.trim();
    if (!title) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingId ? { ...task, title } : task,
      ),
    );
    cancelEditing();
  }

  function deleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    if (editingId === id) cancelEditing();
  }

  const filters = [
    { id: 'all', label: 'All tasks' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#10221b]">
      <header className="border-b border-[#e7eae7] bg-white/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#main-content" className="flex items-center gap-3" aria-label="TaskVerde home">
            <span className="grid size-10 place-items-center rounded-lg bg-[#0d5c43] text-white shadow-sm">
              <Check size={22} strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="font-serif text-2xl font-semibold">TaskVerde</span>
          </a>

          <div className="hidden items-center gap-2 text-sm text-[#63716b] sm:flex">
            <Leaf size={17} className="text-[#0d7b58]" aria-hidden="true" />
            <span>Make today count</span>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <section className="mb-8 grid gap-6 border-b border-[#e2e8e4] pb-9 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-[#0d7b58]">
              <span className="size-2 rounded-full bg-[#48d99e]" />
              Daily focus
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              What will you accomplish today?
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#63716b]">
              Keep your list clear, finish what matters, and let the rest wait.
            </p>
          </div>

          <div className="flex gap-3 md:justify-end" aria-label="Task summary">
            <div className="min-w-24 border-l-2 border-[#48d99e] pl-3">
              <p className="text-2xl font-semibold">{counts.active}</p>
              <p className="text-xs text-[#63716b]">To do</p>
            </div>
            <div className="min-w-24 border-l-2 border-[#d6e2dc] pl-3">
              <p className="text-2xl font-semibold">{counts.completed}</p>
              <p className="text-xs text-[#63716b]">Done</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="add-task-heading" className="mb-8 rounded-lg border border-[#e4eae6] bg-white p-4 shadow-[0_8px_30px_rgba(16,34,27,0.04)] sm:p-6">
          <h2 id="add-task-heading" className="sr-only">Add a new task</h2>
          <form onSubmit={addTask} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="new-task" className="sr-only">Task name</label>
            <div className="relative min-w-0 flex-1">
              <ClipboardList
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#0d7b58]"
                aria-hidden="true"
              />
              <input
                id="new-task"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                className="h-12 w-full rounded-md border border-[#d9e1dc] bg-[#fbfcfb] pl-12 pr-4 text-base outline-none transition placeholder:text-[#8b9792] focus:border-[#0d7b58] focus:ring-2 focus:ring-[#0d7b58]/15"
                placeholder="Add something you want to get done..."
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#123f31] px-5 font-semibold text-white transition hover:bg-[#0d5c43] focus:outline-none focus:ring-2 focus:ring-[#0d7b58] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus size={19} aria-hidden="true" />
              Add task
            </button>
          </form>
        </section>

        <section aria-labelledby="task-list-heading">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="task-list-heading" className="font-serif text-2xl font-semibold">My tasks</h2>
              <p className="mt-1 text-sm text-[#728079]">
                {counts.all === 0 ? 'Your list is ready for a fresh start.' : `${counts.all} ${counts.all === 1 ? 'task' : 'tasks'} in your list`}
              </p>
            </div>

            <div className="flex w-full rounded-md bg-[#edf1f8] p-1 sm:w-auto" aria-label="Filter tasks">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                  className={`min-w-0 flex-1 rounded px-3 py-2 text-sm font-medium transition sm:flex-none ${
                    filter === item.id
                      ? 'bg-white text-[#123f31] shadow-sm'
                      : 'text-[#66736d] hover:text-[#123f31]'
                  }`}
                >
                  {item.label} <span className="ml-1 text-xs opacity-70">{counts[item.id]}</span>
                </button>
              ))}
            </div>
          </div>

          {visibleTasks.length > 0 ? (
            <ul className="space-y-3">
              {visibleTasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-lg border border-[#e4e9e6] bg-white p-4 shadow-[0_4px_18px_rgba(16,34,27,0.035)] transition hover:border-[#cddbd3] sm:p-5"
                >
                  {editingId === task.id ? (
                    <form onSubmit={saveEdit} className="flex flex-col gap-3 sm:flex-row">
                      <label htmlFor={`edit-${task.id}`} className="sr-only">Edit task</label>
                      <input
                        id={`edit-${task.id}`}
                        value={editValue}
                        onChange={(event) => setEditValue(event.target.value)}
                        className="h-11 min-w-0 flex-1 rounded-md border border-[#0d7b58] px-3 outline-none ring-2 ring-[#0d7b58]/10"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={!editValue.trim()}
                          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#123f31] px-4 text-sm font-semibold text-white hover:bg-[#0d5c43] disabled:opacity-45 sm:flex-none"
                        >
                          <Save size={17} aria-hidden="true" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-[#d9e1dc] text-[#52615a] hover:bg-[#f2f5f3]"
                          aria-label="Cancel editing"
                          title="Cancel editing"
                        >
                          <X size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded border transition focus:outline-none focus:ring-2 focus:ring-[#0d7b58] focus:ring-offset-2 ${
                          task.completed
                            ? 'border-[#2b8c6b] bg-[#2b8c6b] text-white'
                            : 'border-[#bbc7c0] bg-white text-transparent hover:border-[#2b8c6b]'
                        }`}
                        aria-label={task.completed ? `Mark ${task.title} as active` : `Mark ${task.title} as completed`}
                      >
                        <Check size={15} strokeWidth={3} aria-hidden="true" />
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className={`break-words text-base leading-6 ${task.completed ? 'text-[#84908a] line-through' : 'text-[#1d2d26]'}`}>
                          {task.title}
                        </p>
                        <p className="mt-1 text-xs text-[#8a958f]">
                          {task.completed ? 'Completed' : 'In progress'}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => beginEditing(task)}
                          className="grid size-9 place-items-center rounded-md text-[#69766f] transition hover:bg-[#eef4f0] hover:text-[#0d694b] focus:outline-none focus:ring-2 focus:ring-[#0d7b58]"
                          aria-label={`Edit ${task.title}`}
                          title="Edit task"
                        >
                          <Pencil size={17} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="grid size-9 place-items-center rounded-md text-[#69766f] transition hover:bg-[#fff0ee] hover:text-[#b63d32] focus:outline-none focus:ring-2 focus:ring-[#b63d32]"
                          aria-label={`Delete ${task.title}`}
                          title="Delete task"
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-[#cfd9d3] bg-white/50 px-5 py-12 text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#e7f7ef] text-[#0d7b58]">
                  <CheckCircle2 size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold">
                  {filter === 'completed' ? 'Nothing completed yet' : filter === 'active' ? 'All caught up' : 'Your list is empty'}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#728079]">
                  {filter === 'all'
                    ? 'Add your first task above and take the day one step at a time.'
                    : 'Choose another view to see the rest of your tasks.'}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="px-5 pb-8 text-center text-xs text-[#84908a]">
        TaskVerde keeps your tasks in this browser.
      </footer>
    </div>
  );
}

export default App;
