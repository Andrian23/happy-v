import { FC } from "react"

interface LinkProps {
  className: string
}

const Link: FC<LinkProps> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_3301_82932)">
      <path
        d="M9.269 13.5002L8.5701 14.1991C7.93542 14.8235 7.07972 15.1719 6.18938 15.1683C5.29905 15.1646 4.44621 14.8093 3.81664 14.1798C3.18707 13.5502 2.83178 12.6974 2.82815 11.807C2.82453 10.9167 3.17286 10.061 3.79728 9.42631L5.49252 7.73459C6.10059 7.12528 6.91851 6.77135 7.77893 6.74521C8.63936 6.71907 9.47725 7.02269 10.1212 7.59396"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.72719 4.5001L9.42609 3.80119C10.0608 3.17677 10.9165 2.82843 11.8068 2.83206C12.6971 2.83568 13.55 3.19098 14.1796 3.82055C14.8091 4.45011 15.1644 5.30295 15.168 6.19329C15.1717 7.08363 14.8233 7.93933 14.1989 8.574L12.5037 10.2692C11.8951 10.8781 11.077 11.2313 10.2166 11.2568C9.35614 11.2823 8.5185 10.9781 7.875 10.4063"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_3301_82932">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default Link
