import OfficeForm from '../OfficeForm';
import { createOffice } from '../actions';

export default function NewOffice() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Office</h1>
          <p className="admin-page-sub">Add an office location.</p>
        </div>
      </div>
      <OfficeForm action={createOffice} />
    </>
  );
}
