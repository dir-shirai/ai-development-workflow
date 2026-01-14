'use client';

import { useState } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subTasks: SubTask[];
  isExpanded: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editingSubTaskTitle, setEditingSubTaskTitle] = useState('');
  const [newSubTaskTitle, setNewSubTaskTitle] = useState<{ [taskId: string]: string }>({});

  // タスクの追加
  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'Pending',
      subTasks: [],
      isExpanded: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // タスクの削除
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // タスクのステータス変更
  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
  };

  // タスクの編集開始
  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  // タスクの編集完了
  const finishEditingTask = () => {
    if (!editingTitle.trim()) return;

    setTasks(tasks.map(task =>
      task.id === editingTaskId ? { ...task, title: editingTitle } : task
    ));
    setEditingTaskId(null);
    setEditingTitle('');
  };

  // タスクの展開/折りたたみ
  const toggleTaskExpansion = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  // サブタスクの追加
  const addSubTask = (taskId: string) => {
    const subTaskTitle = newSubTaskTitle[taskId];
    if (!subTaskTitle?.trim()) return;

    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title: subTaskTitle,
      status: 'Pending',
    };

    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subTasks: [...task.subTasks, newSubTask] }
        : task
    ));

    setNewSubTaskTitle({ ...newSubTaskTitle, [taskId]: '' });
  };

  // サブタスクの削除
  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subTasks: task.subTasks.filter(st => st.id !== subTaskId) }
        : task
    ));
  };

  // サブタスクのステータス変更
  const updateSubTaskStatus = (taskId: string, subTaskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.map(st =>
              st.id === subTaskId ? { ...st, status } : st
            ),
          }
        : task
    ));
  };

  // サブタスクの編集開始
  const startEditingSubTask = (subTask: SubTask) => {
    setEditingSubTaskId(subTask.id);
    setEditingSubTaskTitle(subTask.title);
  };

  // サブタスクの編集完了
  const finishEditingSubTask = (taskId: string) => {
    if (!editingSubTaskTitle.trim()) return;

    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.map(st =>
              st.id === editingSubTaskId ? { ...st, title: editingSubTaskTitle } : st
            ),
          }
        : task
    ));

    setEditingSubTaskId(null);
    setEditingSubTaskTitle('');
  };

  // ステータスバッジのスタイル
  const getStatusBadgeClass = (status: TaskStatus) => {
    const baseClass = 'px-2 py-1 rounded text-xs font-medium';
    switch (status) {
      case 'Pending':
        return `${baseClass} bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300`;
      case 'Running':
        return `${baseClass} bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-300`;
      case 'Completed':
        return `${baseClass} bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          TODO管理アプリ
        </h1>

        {/* 新しいタスクの追加フォーム */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            新しいタスクを追加
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="タスク名を入力..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              追加
            </button>
          </div>
        </div>

        {/* タスクリスト */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
              タスクがありません。上のフォームから新しいタスクを追加してください。
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                {/* タスク本体 */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {/* 展開/折りたたみボタン */}
                    <button
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {task.isExpanded ? '▼' : '▶'}
                    </button>

                    {/* タスクタイトル */}
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && finishEditingTask()}
                        onBlur={finishEditingTask}
                        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`flex-1 text-lg font-medium ${
                          task.status === 'Completed'
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                    )}

                    {/* ステータスセレクト */}
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`${getStatusBadgeClass(task.status)} cursor-pointer`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Running">Running</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {/* アクションボタン */}
                    {editingTaskId !== task.id && (
                      <>
                        <button
                          onClick={() => startEditingTask(task)}
                          className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>

                  {/* サブタスクエリア */}
                  {task.isExpanded && (
                    <div className="mt-4 ml-8 space-y-3">
                      {/* サブタスク追加フォーム */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSubTaskTitle[task.id] || ''}
                          onChange={(e) =>
                            setNewSubTaskTitle({ ...newSubTaskTitle, [task.id]: e.target.value })
                          }
                          onKeyPress={(e) => e.key === 'Enter' && addSubTask(task.id)}
                          placeholder="サブタスクを追加..."
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => addSubTask(task.id)}
                          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded font-medium transition-colors"
                        >
                          追加
                        </button>
                      </div>

                      {/* サブタスクリスト */}
                      {task.subTasks.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          サブタスクがありません
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {task.subTasks.map((subTask) => (
                            <div
                              key={subTask.id}
                              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                            >
                              {editingSubTaskId === subTask.id ? (
                                <input
                                  type="text"
                                  value={editingSubTaskTitle}
                                  onChange={(e) => setEditingSubTaskTitle(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && finishEditingSubTask(task.id)}
                                  onBlur={() => finishEditingSubTask(task.id)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  className={`flex-1 text-sm ${
                                    subTask.status === 'Completed'
                                      ? 'line-through text-gray-500 dark:text-gray-400'
                                      : 'text-gray-900 dark:text-white'
                                  }`}
                                >
                                  {subTask.title}
                                </span>
                              )}

                              <select
                                value={subTask.status}
                                onChange={(e) =>
                                  updateSubTaskStatus(task.id, subTask.id, e.target.value as TaskStatus)
                                }
                                className={`${getStatusBadgeClass(subTask.status)} cursor-pointer text-xs`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Running">Running</option>
                                <option value="Completed">Completed</option>
                              </select>

                              {editingSubTaskId !== subTask.id && (
                                <>
                                  <button
                                    onClick={() => startEditingSubTask(subTask)}
                                    className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                                  >
                                    編集
                                  </button>
                                  <button
                                    onClick={() => deleteSubTask(task.id, subTask.id)}
                                    className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                                  >
                                    削除
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
