import Active from "@/icons/Active"
import Ambassador from "@/icons/Ambassador"
import Community from "@/icons/Community"
import Declined from "@/icons/Declined"
import Dialog from "@/icons/Dialog"
import FAQ from "@/icons/FAQ"
import Like from "@/icons/Like"
import Link from "@/icons/Link"
import Megaphone from "@/icons/Megaphone"
import Pill from "@/icons/Pill"
import Registration from "@/icons/Registration"
import Review from "@/icons/Review"
import SecondList from "@/icons/SecondList"
import Service from "@/icons/Service"
import Settings from "@/icons/Settings"
import Stats from "@/icons/Stats"
import { ApprovalUserStatus, PartnerStatus } from "@/models/participants"

const classes = "md:stroke-light-grey stroke-black"

export const linksProducts = [
  {
    name: "Dashboard",
    icon: <Stats className={classes} />,
    link: "/dashboard",
  },
  {
    name: "Wholesale products",
    icon: <Pill className={classes} />,
    link: "/products",
  },
  {
    name: "My orders",
    icon: <SecondList className={classes} />,
    link: "/orders",
  },
  {
    name: "Affiliate links",
    icon: <Link className={classes} />,
    link: "/affiliate",
  },
  {
    name: "Recommendations",
    icon: <Dialog className={classes} />,
    link: "/recommendations",
  },
]

export const linksMedia = [
  {
    name: "Marketing & Education assets",
    icon: <Megaphone className={classes} />,
    link: "/marketing",
  },
  {
    name: "Social media assets",
    icon: <Like className={classes} />,
    link: "/social",
  },
  {
    name: "Community forum",
    icon: <Community className={classes} />,
    link: "/community",
  },
  {
    name: "Become an Ambassador",
    icon: <Ambassador className={classes} />,
    link: "/ambassador",
  },
]

export const linksSettings = [
  {
    name: "Account settings",
    icon: <Settings className={classes} />,
    link: "/settings",
  },
  {
    name: "FAQs",
    icon: <FAQ className={classes} />,
    link: "/faqs",
  },
  {
    name: "Contact us",
    icon: <Service className={classes} />,
    link: "/contact",
  },
]

export const adminNavigation = {
  dropdownMenu: [
    {
      name: "Ambassadors hub",
      icon: <Registration className={classes} />,
      hasNotification: true,
      subLinks: [
        {
          name: "Pending for Review",
          icon: <Review className={classes} />,
          link: `/super-admin/ambassador?status=${ApprovalUserStatus.PENDING_REVIEW}`,
          count: 8,
        },
        {
          name: "Active Ambassadors",
          icon: <Active className={classes} />,
          link: `/super-admin/ambassador?status=${ApprovalUserStatus.ACTIVE}`,
          count: 12,
        },
        {
          name: "Declined Request",
          icon: <Declined className={classes} />,
          link: `/super-admin/ambassador?status=${ApprovalUserStatus.DECLINED}`,
          count: 12,
        },
      ],
    },
    {
      name: "Partners hub",
      icon: <Ambassador className={classes} />,
      hasNotification: true,
      subLinks: [
        {
          name: "Pending for Review",
          icon: <Review className={classes} />,
          link: `/super-admin/partners?status=${PartnerStatus.PENDING_REVIEW}`,
          count: 8,
        },
        {
          name: "Active Partners",
          icon: <Active className={classes} />,
          link: `/super-admin/partners?status=${PartnerStatus.ACTIVE}`,
          count: 12,
        },
        {
          name: "Declined Request",
          icon: <Declined className={classes} />,
          link: `/super-admin/partners?status=${PartnerStatus.DECLINED}`,
          count: 12,
        },
      ],
    },
  ],
  links: [
    { name: "Marketing & Education assets", icon: <Megaphone className={classes} />, link: "/super-admin/marketing" },
    { name: "Social media assets", icon: <Like className={classes} />, link: "/super-admin/social" },
    { name: "Community forum", icon: <Community className={classes} />, link: "/super-admin/forum" },
  ],
}
