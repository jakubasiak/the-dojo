import { useState } from "react"
import ProjectList from "../../components/ProjectList"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useCollection } from "../../hooks/useCollection"
import './Dashboard.css'
import ProjectFilter, { filterList } from "./ProjectFilter"

export default function Dashboard() {
  const { documents, error } = useCollection('projects')
  const [currentFilter, setCurrentFilter] = useState(filterList[0])
  const { user } = useAuthContext()

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  const projects = documents?.filter((document) => {
    switch (currentFilter) {
      case filterList[0]: // all
        return true;
      case filterList[1]: // mine
        let assignedToMe = false
        document.assignedUsersList.forEach(u => {
          if(u.id === user.uid) {
            assignedToMe = true
          }
        });
        return assignedToMe
      case filterList[2]: // development
      case filterList[3]: // design
      case filterList[4]: // marketing
      case filterList[5]: // sales
        return document.category === currentFilter
      default:
        return true
    }
  })

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />}
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}
