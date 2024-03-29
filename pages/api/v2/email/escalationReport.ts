import {find, groupBy} from "lodash";
import {NextApiRequestExtended} from "../../../../mongodb/authHandler";
import {
  escalationCollectionName,
  umoorListCollectionName,
  userCollectionName,
} from "../../../../mongodb/dbCollectionNames";
import getNoAuthHandler from "../../../../mongodb/noAuthHandler";
import {authUser, escalationStatus, userRoles} from "../../../../types";
import {handleResponse} from "../../../../utils/handleResponse";
import moment from "moment";

export default getNoAuthHandler().post(
  async (req: NextApiRequestExtended, res) => {
    const dbUserList = await req.db
      .collection(userCollectionName)
      .find()
      .toArray();

    const dbUmoorList = await req.db
      .collection(umoorListCollectionName)
      .find()
      .toArray();

    const totalCount = await req.db
      .collection(escalationCollectionName)
      .aggregate([
        {$match: {}},
        {
          $group: {
            _id: "$type.value",
            count: {$sum: 1},
          },
        },
        {$sort: {_id: 1}},
      ])
      .toArray();

    const statusArr = Object.values(escalationStatus);

    const statusWiseCount = await Promise.all(
      statusArr.map(async (val: string) => {
        const countArr = await req.db
          .collection(escalationCollectionName)
          .aggregate([
            {$match: {status: val}},
            {
              $group: {
                _id: "$type.value",
                count: {$sum: 1},
              },
            },
            {$sort: {_id: 1}},
          ])
          .toArray();

        return {
          status: val,
          count: countArr,
        };
      })
    );

    statusWiseCount.push({
      status: "Total",
      count: totalCount,
    });

    const userAdminList = dbUserList
      .filter((val: authUser) => val.userRole.includes(userRoles.Admin))
      .map((user: any) => ({
        email: user.email,
        name: user.name,
      }));

    const userUmoorList: any[] = [];
    const umoorList = dbUserList
      .filter((val: authUser) => val.userRole.includes(userRoles.Umoor))
      .map((user: any) => ({
        email: user.email,
        name: user.name,
        assignedUmoor: user.assignedUmoor,
      }));

    umoorList.map((element: any) => {
      element.assignedUmoor.map((val: any) => {
        userUmoorList.push({
          email: element.email,
          name: element.name,
          assignedUmoor: val,
        });
      });
    });

    const getUmoorStats = (umoor: string) => {
      const statsTotalCountArr =
        (find(statusWiseCount, {
          status: "Total",
        }) &&
          find(statusWiseCount, {
            status: "Total",
          })?.count) ||
        0;
      const umoorTotalCount =
        (find(statsTotalCountArr, {_id: umoor}) &&
          find(statsTotalCountArr, {_id: umoor}).count) ||
        0;

      const umoorStatusWiseCount = statusArr.map((status: escalationStatus) => {
        const statusCountArr =
          (find(statusWiseCount, {status}) &&
            find(statusWiseCount, {status})?.count) ||
          0;
        return {
          status,
          count: find(statusCountArr, {_id: umoor})
            ? find(statusCountArr, {_id: umoor}).count
            : 0,
        };
      });

      return {
        total: umoorTotalCount,
        reported: find(umoorStatusWiseCount, {
          status: escalationStatus.ISSUE_REPORTED,
        })?.count,
        inprocess: find(umoorStatusWiseCount, {
          status: escalationStatus.IN_PROGRESS,
        })?.count,
        resolved: find(umoorStatusWiseCount, {
          status: escalationStatus.RESOLVED,
        })?.count,
        closed: find(umoorStatusWiseCount, {status: escalationStatus.CLOSED})
          ?.count,
      };
    };

    const adminStats = statusWiseCount.map((data: any) => {
      const totalCount = data.count.reduce((sum: any, n: any) => {
        return sum + n.count;
      }, 0);
      return {
        status: data.status,
        count: totalCount,
      };
    });

    const umoorWiseUser = groupBy(userUmoorList, "assignedUmoor");

    const adminMessageVersion = {
      to: userAdminList,
      params: {
        heading: "This is the report of AEM Escalations for Admin",
        umoor: "Admin",
        total:
          (find(adminStats, {status: "Total"}) &&
            find(adminStats, {status: "Total"})?.count) ||
          0,
        reported:
          (find(adminStats, {status: escalationStatus.ISSUE_REPORTED}) &&
            find(adminStats, {status: escalationStatus.ISSUE_REPORTED})
              ?.count) ||
          0,
        inprocess:
          (find(adminStats, {status: escalationStatus.IN_PROGRESS}) &&
            find(adminStats, {status: escalationStatus.IN_PROGRESS})?.count) ||
          0,
        resolved:
          (find(adminStats, {status: escalationStatus.RESOLVED}) &&
            find(adminStats, {status: escalationStatus.RESOLVED})?.count) ||
          0,
        closed:
          (find(adminStats, {status: escalationStatus.CLOSED}) &&
            find(adminStats, {status: escalationStatus.CLOSED})?.count) ||
          0,
        link: process.env.NEXT_PUBLIC_ROOT_API_URL + "/admin/dashboard",
      },
    };

    const mailMessageVersions = dbUmoorList.map((umoorValue: any) => {
      return {
        to: umoorWiseUser[umoorValue.value]
          ? umoorWiseUser[umoorValue.value].map((data: any) => ({
              email: data.email || "ddedhawala@gmail.com",
              name: data.name,
            }))
          : [{email: "ddedhawala@gmail.com", name: "Admin"}],
        params: {
          ...getUmoorStats(umoorValue.value),
          heading:
            "This is the report of AEM Escalations for " + umoorValue.label,
          umoor: umoorValue.label,
          link: process.env.NEXT_PUBLIC_ROOT_API_URL + "/escalations",
        },
      };
    });

    mailMessageVersions.push(adminMessageVersion);

    const mailHTMLConetent = `<!DOCTYPE html>
        <html>
          <body>
            <h2>{{params.heading}}</h2>
            <br />
            <h3>Below is the summary for {{params.umoor}}</h3>
            <br />
            <table border=1 cellspacing=1 cellpadding=10>
            <tr>
            <th style='text-align:left'> Total Issues Reported</th>
            <td style='text-align:right'> {{params.total}}</td>
            </tr>
            <tr>
            <th style='text-align:left'> Issues Pending action</th>
            <td style='text-align:right'> {{params.reported}}</td>
            </tr>
            <tr>
            <th style='text-align:left'> Resolution In Process</th>
            <td style='text-align:right'> {{params.inprocess}}</td>
            </tr>
            <tr>
            <th style='text-align:left'> Resolved</th>
            <td style='text-align:right'> {{params.resolved}}</td>
            </tr>
            </table>
            <p style='font-size: 16px;'>Click <a href='{{params.link}}'>here </a> to view details.</p>
            <br/>
            <p style='font-size: 16px;'>Login with your ITS ID
            and Password (first four characters of your first name in small letters and last four digits of your ITS)
            </p>
            <br/>
            <p style='font-size: 16px;'><b>Ex: Shabbir Rampurawala having ITS: 30401234 will have password as shab1234</b></p>
          </body>
        </html>`;

    const mailSubject =
      "Weekly Report for AEM Escalations Dated: " +
      moment(new Date()).format("DD/MM/YYYY");

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

    const mailBody = {
      sender: {
        email: mailSenderEmail,
        name: mailSenderName,
      },
      subject: mailSubject,
      htmlContent: mailHTMLConetent,
      messageVersions: mailMessageVersions,
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
  }
);
