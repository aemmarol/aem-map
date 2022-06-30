import {isEmpty} from "lodash";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../mongodb/authHandler";
import {handleResponse} from "../../../../utils/handleResponse";

export default getAuthHandler().post(
  async (req: NextApiRequestExtended, res) => {
    const escalationDetails = JSON.parse(req.body);
    if (!isEmpty(escalationDetails)) {
      const mailApiKey: string = process.env
        .NEXT_PUBLIC_SENDMAIL_API_KEY as string;
      const mailSenderName: string = process.env
        .NEXT_PUBLIC_MAIL_SENDER_NAME as string;
      const mailSenderEmail: string = process.env
        .NEXT_PUBLIC_MAIL_SENDER_EMAIL as string;
      const apiHeaders = new Headers();
      apiHeaders.append("Accept", "application/json");
      apiHeaders.append("api-key", mailApiKey);
      apiHeaders.append("Content-Type", "application/json");

      const mailSubject =
        "New Escalation " +
        escalationDetails.escalation_id +
        " has been reported.";
      const userList: any = escalationDetails.toList.map((user: any) => ({
        email: user.email,
        name: user.name,
      }));

      const mailBody = {
        sender: {
          email: mailSenderEmail,
          name: mailSenderName,
        },
        subject: mailSubject,
        htmlContent:
          "<!DOCTYPE html><html><body><h2>{{params.heading}}</h2><br/><p>{{params.para}}</p><br/><p>Click <a href='{{params.link}}' >here </a> to view details.</p></body></html>",
        messageVersions: [
          {
            to: userList,
            params: {
              heading: escalationDetails.escalation_id + " has been reported.",
              para:
                "This ticket has been raised on " +
                escalationDetails.created_at +
                " by " +
                escalationDetails.created_by.name,
              link:
                process.env.NEXT_PUBLIC_ROOT_API_URL +
                "/escalations/" +
                escalationDetails._id,
            },
          },
        ],
      };
      await fetch("https://api.sendinblue.com/v3/smtp/email", {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(mailBody),
      })
        .then(handleResponse)
        .then((response) => {
          res.json(response);
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    } else {
      res.status(400).json({msg: "invalid request!"});
    }
  }
);
