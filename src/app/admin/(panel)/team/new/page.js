import TeamMemberForm from '../TeamMemberForm';
import { createTeamMember } from '../actions';

export default function NewTeamMember() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">New Member</h1>
          <p className="admin-page-sub">Add a member to Leadership.</p>
        </div>
      </div>
      <TeamMemberForm action={createTeamMember} />
    </>
  );
}
