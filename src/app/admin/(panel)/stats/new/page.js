import StatForm from '../StatForm';
import { createStat } from '../actions';

export default function NewStat() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Stat</h1>
          <p className="admin-page-sub">Add a stat to the homepage.</p>
        </div>
      </div>
      <StatForm action={createStat} />
    </>
  );
}
