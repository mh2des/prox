'use client';

import { useFormStatus } from 'react-dom';

function SubmitDelete({ label, confirmMessage }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-danger btn-sm"
      disabled={pending}
      onClick={(e) => {
        // Confirm before the destructive action fires; block double-submit.
        if (pending || !window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {pending ? 'Deleting…' : label}
    </button>
  );
}

// Drop-in replacement for the bare `<form action={deleteX.bind(null,id)}>`
// delete controls: adds a confirm dialog and a disabled/pending state.
export default function DeleteButton({
  action,
  label = 'Delete',
  confirmMessage = 'Delete this permanently? This cannot be undone.',
}) {
  return (
    <form action={action} style={{ display: 'inline' }}>
      <SubmitDelete label={label} confirmMessage={confirmMessage} />
    </form>
  );
}
