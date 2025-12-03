import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="task-container">
    <header class="header">
      <h1 class="title">CosmicTime</h1>
      <p class="subtitle">Your tasks, organized.</p>
    </header>
    <div id="task-list">
      <!-- Tasks will go here -->
      <p style="color: #9ca3af; text-align: center; padding: 2rem 0;">No tasks yet.</p>
    </div>
  </div>
`
