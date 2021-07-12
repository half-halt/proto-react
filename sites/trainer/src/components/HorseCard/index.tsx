import { FC } from "react";
import { Horse } from "@hhf/trainer-api-types";
import "./card.css";
import { Link } from "react-router-dom";

interface HorseCardProps {
	horse: Horse
}

export const HorseCard: FC<HorseCardProps> = ({
	horse
}) => {
	const hasNickname = (typeof(horse.nickname) === 'string') && (horse.nickname.length !== 0);

	return (
		<section className="hhf-horseCard">
			{hasNickname &&
				<>
					<h2>{horse.nickname}</h2>
					<h3>{horse.name}</h3>
				</>
			}
			{!hasNickname &&
				<h2>{horse.name}</h2> 
			}
			<ul className="actions">
				<Link to={`delete/${horse.id}`}>delet</Link>
				<Link to={`edit/${horse.id}`}>edit</Link>
			</ul>
		</section>
	)
}