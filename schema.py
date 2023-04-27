import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, Section as SectionModel, Task as TaskModel
import stripe
from flask_keycloak import login_required
stripe.api_key = "stripe_api_key"

class Section(SQLAlchemyObjectType):
    class Meta:
        model = SectionModel
        interfaces = (relay.Node, )


class Task(SQLAlchemyObjectType):
    class Meta:
        model = TaskModel
        interfaces = (relay.Node, )
#add new task
class CreateTask(graphene.Mutation):
    class Arguments:
        name=graphene.String(required=True)
        section_id=graphene.ID(required=True)
        
    task=graphene.Field(lambda: Task)
    
    @login_required #protecting the routes
    def mutate(self, info, name, section_id):
        section=SectionModel.query.filter_by(id=section_id).first()
        task=TaskModel(name=name, section=section)
        db_session.add(task)
        db_session.commit()
        return CreateTask(task=task)
# By adding info as the first argument in the mutate method, you are indicating to GraphQL that this is the context object that it expects to be passed in, and then you can access the other arguments, name and section_id, as keyword arguments.
class PremiumCreateTask(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        section_id = graphene.ID(required=True)
        image = graphene.String(required=True)
        amount = graphene.Float(required=True)
        token = graphene.String(required=True)

    task = graphene.Field(lambda: Task)

    @login_required
    def mutate(self, info, name, section_id, image, amount, token):
        # Verify the payment
        try:
            charge = stripe.Charge.create(
                amount=int(amount * 100),
                currency="usd",
                description="Payment for task creation",
                source=token,
            )
        except stripe.error.CardError as e:
            # The card has been declined
            return CreateTask(task=None)

        # Payment succeeded, create the task
        section = SectionModel.query.filter_by(id=section_id).first()
        task = TaskModel(name=name, section=section, image=image)
        db_session.add(task)
        db_session.commit()
        return CreateTask(task=task)

# update an existing task
class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String(required=True)
        section_id = graphene.ID(required=True)
        
    task = graphene.Field(lambda: Task)
    
    @login_required
    def mutate(self, info, id, name, section_id):
        task = TaskModel.query.filter_by(id=id).first()
        if task:
            section = SectionModel.query.filter_by(id=section_id).first()
            task.name = name
            task.section = section
            db_session.commit()
        else:
            raise Exception("Invalid Task ID")
        return UpdateTask(task=task)

# delete an existing task
class DeleteTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        
    ok = graphene.Boolean()
    
    @login_required
    def mutate(self, info, id):
        task = TaskModel.query.filter_by(id=id).first()
        if task:
            db_session.delete(task)
            db_session.commit()
            ok = True
        else:
            raise Exception("Invalid Task ID")
            ok = False
        return DeleteTask(ok=ok)
class Query(graphene.ObjectType):
    node = relay.Node.Field()
    # Allows sorting over multiple columns, by default over the primary key
    all_tasks = SQLAlchemyConnectionField(Task.connection)
    # Disable sorting over this field
    all_sections = SQLAlchemyConnectionField(Section.connection, sort=None)


class Mutation(graphene.ObjectType):
    create_task=CreateTask.Field()
    update_task=UpdateTask.Field()
    delete_task = DeleteTask.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)