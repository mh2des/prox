import JobForm from '../JobForm';
import { createJob } from '../actions';

export default function NewJob() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Job</h1>
          <p className="admin-page-sub">Add a job to Careers.</p>
        </div>
      </div>
      <JobForm action={createJob} />
    </>
  );
}
