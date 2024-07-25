import "./ResponseMsgPage.css";

function ResponseMsg({ type }) {

  return (
    <>
      {type === "thankyou" ? (
        <div className="response-main-section">
          <h1>Thank you for applying!</h1>
          <p>
            Your application has been accepted. You will be notified via Discord
            when your application's status changes.
          </p>
        </div>
      ) : type === "error" ? (
        <div className="response-main-section">
          <h1>Error</h1>
          <p>
            There was an error processing your request. Please try again later
            or contact Staff members.
          </p>
        </div>
      ) : type === "discord" ? (
        <div className="response-main-section">
          <h1>Not in Discord</h1>
          <p>
            You must be in our Discord server to apply. Please join our Discord
          </p>
        </div>
      ) : null}
    </>
  );
}

export default ResponseMsg;
