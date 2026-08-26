import { site } from '../../data/site'
import Marquee from '../ui/Marquee'

export default function AnnouncementBar() {
  return (
    <div className="border-b border-line bg-ink py-2.5 text-paper">
      <Marquee speed="slow">
        {[0, 1, 2].map((i) => (
          <span key={i} className="text-[11px] uppercase tracking-wide-lg text-paper/80">
            {site.announcement} <span className="mx-6 text-paper/30">✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}
