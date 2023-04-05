import { Answers, PipelineItem } from '@app/features/pass-survey';
import { AnswerDto } from '@app/shared/api';

export default function isObject<TObj>(obj: TObj) {
  var type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

export function mapAnswersToDto(
  pipeline: PipelineItem[],
  answers: Answers,
): Array<AnswerDto> {
  const filteredPipeline = pipeline.filter(item => item.id);

  return Object.entries(answers)
    .filter(([_, answer]) => answer.answer)
    .map(([step, answer]) => {
      const dto: AnswerDto = {
        activityItemId: filteredPipeline[Number(step)]?.id!,
        answer: {
          value: answer.answer as any, //TODO: fix when all types of answers DTOs are done
        },
      };

      const pipelineItem = pipeline[+step];

      if (answer.additionalAnswer) {
        dto.answer.additionalText = answer.additionalAnswer;
      }

      if (pipelineItem.type === 'TextInput') {
        dto.answer.shouldIdentifyResponse =
          pipelineItem.payload.shouldIdentifyResponse;
      }

      return dto;
    });
}
