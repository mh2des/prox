import ClientForm from '../ClientForm';
import { createClient } from '../actions';

export default function NewClient() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Client</h1>
          <p className="admin-page-sub">Add a client.</p>
        </div>
      </div>
      <ClientForm action={createClient} />
    </>
  );
}
