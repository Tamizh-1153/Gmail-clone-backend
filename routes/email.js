const express = require("express")
const router = express.Router()

const {
  getInbox,
  sendEmail,
  getAllEmails,
  getDrafts,
  saveDrafts,
  getStarred,
  toggleStarredEmails,
  getSent,
  getBin,
  moveEmailToBin,
  deleteBin,
  getUserInfo,
} = require("../controllers/email")

router.route("/send").post(sendEmail)
router.route("/all").get(getAllEmails)
router.route("/inbox").get(getInbox)
router.route("/drafts").get(getDrafts).post(saveDrafts)
router.route("/starred").get(getStarred).post(toggleStarredEmails)
router.route("/sent").get(getSent)
router.route('/bin').get(getBin).post(moveEmailToBin).delete(deleteBin)
router.route('/user/info').get(getUserInfo)

module.exports = router
