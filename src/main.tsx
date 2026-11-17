import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ContentProvider } from './store/content'
import './index.css'

/* set the first scene before paint so there is no flash of the wrong colour */
document.documentElement.dataset.scene = 'hero'
document.documentElement.style.setProperty('--scene-bg', '#0A0908')
document.documentElement.style.setProperty('--scene-fg', '#FBF4E2')
document.documentElement.style.setProperty('--scene-accent', '#FF4D0D')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </React.StrictMode>,
)
