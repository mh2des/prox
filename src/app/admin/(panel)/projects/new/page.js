import ProjectForm from '../ProjectForm';
import { createProject } from '../actions';

export default function NewProject() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Project</h1>
          <p className="admin-page-sub">Add a project to Our Work.</p>
        </div>
      </div>
      <ProjectForm action={createProject} />
    </>
  );
}
