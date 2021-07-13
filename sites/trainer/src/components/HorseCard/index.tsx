import { FC } from "react";
import { Horse } from "@hhf/trainer-api-types";
import "./card.scss";
import { Link } from "react-router-dom";
//@ts-ignore
import DeleteIcon from "./trash-alt-light.svg";
//@ts-ignore
import EditIcon from "./pencil-light.svg";

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
				<Link to={`delete/${horse.id}`} className="dangerButton">
					<DeleteIcon/>
					Delete
				</Link>
				<Link to={`edit/${horse.id}`} className="primaryButton">
					<EditIcon/>
					Edit
				</Link>
			</ul>
		</section>
	)
}