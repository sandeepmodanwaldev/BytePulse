import {helthCheck} from "../controller/helthCheck.controller.js"
import {Router} from "express"

const router = Router()

router.route("/").get(helthCheck)

export default router
